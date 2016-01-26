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

import template from './text.jade!';
import './text.css!';

export default ['igniteFormFieldInputText', ['IgniteFormGUID', (guid) => {
    const link = (scope, el, attrs, [form, label]) => {
        const {id, name} = scope;
        const field = form[name];

        scope.form = form;
        scope.field = field;
        label.for = scope.id = id || guid();

        scope.$watch('required', (required) => {
            label.required = required || false;
        });

        form.$defaults = form.$defaults || {};
        form.$defaults[name] = _.cloneDeep(scope.value);

        const setAsDefault = () => {
            if (!form.$pristine) return;

            form.$defaults = form.$defaults || {};
            form.$defaults[name] = _.cloneDeep(scope.value);
        };

        scope.$watch(() => form.$pristine, setAsDefault);
        scope.$watch('value', setAsDefault);
    };

    return {
        restrict: 'E',
        scope: {
            id: '@',
            name: '@',
            placeholder: '@',
            unique: '=igniteUnique',
            required: '=ngRequired',
            disabled: '=ngDisabled',

            value: '=ngModel',
            ngBlur: '&',

            javaKeywords: '=',
            javaIdentifier: '=',
            javaPackageSpecified: '=',
            javaBuiltInClass: '=',
            javaPackageName: '=',

            autofocus: '=igniteFormFieldInputAutofocus'
        },
        link,
        template,
        replace: true,
        transclude: true,
        require: ['^form', '?^igniteFormField']
    };
}]];
