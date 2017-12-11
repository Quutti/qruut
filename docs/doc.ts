
export interface DocumentedComponent {
    docProps: DocProps;
}

export interface DocPropsProp {
    type: string;
    desc: string;
    required?: boolean;
}

export interface DocProps {
    name: string,
    properties?: { [key: string]: DocPropsProp };
}