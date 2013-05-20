不科学，不准确，或许可以说明点什么问题:)

重复计算500万次5000乘以5000, 以下是我机器的数据。

##nodejs(0.10.2)

``` javascript
var sum;
for(var i=0;i<5000000;i++){
  sum = 5000*5000;
}
```
``` bash
$ time node test.js #=> 0.06
```

##php(5.3.10)
``` php
<?PHP
for($i=0; $i<5000000; $i++) {
	$sum=5000*5000;
}
$end=microtime(true);
?>
```

``` bash
$ time php test.php #=> 0.40
```

##lua(5.1.4)
``` lua
i = 1
while i < 5000000 do
  sum = 5000*5000
  i = i + 1
end
```

``` bash
$ time lua test.lua #=> 0.70
```

##python(2.7.3)
``` python
i = 0
while i < 5000000:
  sum = 5000*5000
  i = i + 1
```

``` bash
$ time python test.python #=> 0.78
```

##ruby(1.8.7)
``` ruby
i=0
while i < 5000000
  sum = 5000*5000
  i = i + 1
end
```
``` bash
$ time ruby test.ruby #=> 2.42
```

##io
``` io
for(i, 0, 5000000, 1, ( sum := 5000*5000 ) )
```

``` bash
$ time io test.io #=> 18.23
```

_(完)_
