/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ignite.agent;

import org.apache.commons.codec.*;
import org.apache.http.*;
import org.apache.http.client.entity.*;
import org.apache.http.client.methods.*;
import org.apache.http.client.utils.*;
import org.apache.http.entity.*;
import org.apache.http.impl.client.*;
import org.apache.ignite.agent.messages.*;
import org.apache.ignite.schema.parser.*;

import java.io.*;
import java.net.*;
import java.nio.charset.*;
import java.sql.*;
import java.util.*;

/**
 *
 */
public class Agent {
    /** */
    private final AgentConfiguration cfg;

    /** */
    private CloseableHttpClient httpClient;

    /**
     * @param cfg Config.
     */
    public Agent(AgentConfiguration cfg) {
        this.cfg = cfg;
    }

    /**
     *
     */
    public void start() {
        httpClient = HttpClientBuilder.create().build();
    }

    /**
     *
     */
    public void stop() throws IOException {
        if (httpClient != null)
            httpClient.close();
    }

    /**
     * @param restReq Request.
     */
    public RestResult executeRest(RestRequest restReq) throws IOException, URISyntaxException {
        URIBuilder builder = new URIBuilder(cfg.getNodeUri());

        String path = restReq.getPath();

        if (path != null) {
            if (!path.startsWith("/") && !cfg.getNodeUri().toString().endsWith("/"))
                path = '/' +  path;

            builder.setPath(path);
        }

        if (restReq.getParams() != null) {
            for (Map.Entry<String, String> entry : restReq.getParams().entrySet())
                builder.addParameter(entry.getKey(), entry.getValue());
        }

        if (restReq.getHeaders() != null)
            restReq.setHeaders(restReq.getHeaders());

        HttpRequestBase httpReq;

        if ("GET".equalsIgnoreCase(restReq.getMethod()))
            httpReq = new HttpGet(builder.build());
        else if ("POST".equalsIgnoreCase(restReq.getMethod())) {
            HttpPost post;

            if (restReq.getBody() == null) {
                List<NameValuePair> nvps = builder.getQueryParams();

                builder.clearParameters();

                post = new HttpPost(builder.build());

                if (!nvps.isEmpty())
                    post.setEntity(new UrlEncodedFormEntity(nvps));
            }
            else {
                post = new HttpPost(builder.build());

                post.setEntity(new StringEntity(restReq.getBody()));
            }

            httpReq = post;
        }
        else
            throw new IOException("Unknown HTTP-method: " + restReq.getMethod());

        try (CloseableHttpResponse resp = httpClient.execute(httpReq)) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            resp.getEntity().writeTo(out);

            Charset charset = Charsets.UTF_8;

            Header encodingHdr = resp.getEntity().getContentEncoding();

            if (encodingHdr != null) {
                String encoding = encodingHdr.getValue();

                charset = Charsets.toCharset(encoding);
            }

            RestResult res = new RestResult();

            res.setCode(resp.getStatusLine().getStatusCode());
            res.setExecuted(true);
            res.setMessage(new String(out.toByteArray(), charset));

            return res;
        }
    }

    /**
     * @param req Request.
     */
    public DbMetadataResponse dbMetadataRequest(DbMetadataRequest req) {
        DbMetadataResponse res = new DbMetadataResponse();

        try {
            Connection conn = DBReader.getInstance().connect(req.getJdbcDriverJarPath(), req.getJdbcDriverClass(),
                req.getJdbcUrl(), req.getJdbcInfo());

            Collection<DbTable> tbls = DBReader.getInstance().extractMetadata(conn, req.isTablesOnly());

            res.setTables(tbls);
        }
        catch (SQLException e) {
            res.setError(e.getMessage());
        }

        return res;
    }
}
