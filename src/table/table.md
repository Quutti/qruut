```js

const data = [];

let i = 0;
while (i < 10) {
    data.push({
        id: i,
        name: `First name for ${i}`,
        address: `Address for ${i}`
    });
    i++;
}

<Table data={data}>
    <TableColumn text="Id" propertyKey={'id'} />
    <TableColumn text="Name" propertyKey={'name'} />
    <TableColumn text="Address" propertyKey={'address'} />
</Table>

```

```js

const data = [];

let i = 0;
while (i < 1000) {
    data.push({
        id: i,
        name: `First name for ${i}`,
        address: `Address for ${i}`,
        description: 'Longer description for this item, so it could be go even multiple lines. And this is the second sentence.'
    });
    i++;
}

<Table data={data} itemsPerPage={10}>
    <TableColumn text="Id" propertyKey={'id'} />
    <TableColumn text="Name" propertyKey={'name'} />
    <TableColumn text="Address" propertyKey={'address'} />
    <TableColumn text="Description" propertyKey={'description'} />
</Table>

```