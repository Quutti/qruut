import * as React from 'react';
import * as classNames from 'classnames';

import { uniqueId } from 'lodash';

const styles: any = require('./select.css');

export interface SelectOption {
    value: string;
    text: string;
}

export interface SelectProps {
    className?: string;
    label: string;
    name: string;
    errorText?: string;
    isRequired?: boolean;
    value: string;
    options: SelectOption[];
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}


export const Select: React.SFC<SelectProps> = (props) => {

    const id = uniqueId('qruut-select-');
    const hasError = !!props.errorText;

    const rootClasses = classNames('form-group', styles.root, props.className);
    const labelClasses = classNames('form-control-label', styles.label);
    const feedbackClasses = classNames('form-control-feedback', styles.feedback);
    const selectClasses = classNames(styles.select, {
        [styles.hasError]: hasError
    });


    const items = props.options.map((option, index) => {
        return <option key={index} value={option.value}>{option.text}</option>
    });

    return (
        <div className={rootClasses}>
            <label className={labelClasses} htmlFor={id}>
                {props.isRequired && <span className={styles.requiredSign}>*</span>}
                {props.label}
            </label>
            <select
                className={selectClasses}
                value={props.value}
                name={props.name}
                id={id}
                onChange={props.onChange}
            >
                {items}
            </select>
            {hasError && <div className={feedbackClasses}>{props.errorText}</div>}
        </div >
    )
}

Select.displayName = 'Select';

Select.defaultProps = {

}

export default Select;