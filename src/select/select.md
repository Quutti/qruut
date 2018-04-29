```js

    const items = [
        { value: '1', text: 'Option 1' },
        { value: '2', text: 'Option 2' },
        { value: '3', text: 'Option 3' },
        { value: '4', text: 'Option 4' },
        { value: '5', text: 'Option 5' }
    ];

    initialState = {
        value: '3'
    }

    ;<Select
        options={items}
        label='Test 1'
        name='select-1'
        value={state.value}
        onChange={(evt) => { setState({ value: evt.target.value }) }}
    />

```