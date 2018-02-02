```js

let i = 0;
const data1 = [];
const data2 = [];

while(i < 10) {
    data1.push({
        xValue: i + 1,
        yValue: Math.round(Math.random() * 5000)
    });

    data2.push({
        xValue: i + 1,
        yValue: Math.round(Math.random() * 5000)
    });

    i++;
}

<LineChart lines={[{ data: data1 }, { data: data2}]} xAxis={{ scale: "linear" }} />
```