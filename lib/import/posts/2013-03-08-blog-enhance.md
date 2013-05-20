通过github默认构建工具生成的博客功能还是非常单薄的，所以就需要做点后期工作添加一些常见的功能，例如：搜索、评论、订阅和归档页面。

##构建工具

写了一个简单的Makefile来做自动构建的工作：
``` make

all: css js site

css:
	@sqwish stylesheets/styles.css

js:
	@cat javascripts/respond.js javascripts/common.js | uglifyjs > javascripts/main.min.js

site:
	@jekyll --rdiscount

watch:
	@jekyll --rdiscount --server --auto

.PHONY: css
```

这样我在vim调用:make命令就完成压缩合并资源文件和本地部署文件的任务了。

##图标

使用了[One div](http://one-div.com/)上面的几个css样式，这样可以减少图片文件的请求数量，加快响应时间，不过现在图标在移动设备的Chrome上显示有点大，暂时还没解决。

##订阅功能

订阅有两种：一种是rss，一种是atom，都是从githab上面找的模板。
``` xml
---
layout: none
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>{{ site.name }}</title>
		<description>{{ site.description }}</description>
		<link>{{ site.url }}</link>
		<atom:link href="{{ site.url }}/feed.xml" rel="self" type="application/rss+xml" />
		{% for post in site.posts limit:10 %}
			<item>
				<title>{{ post.title }}</title>
				<description>{{ post.content | xml_escape }}</description>
				<pubDate>{{ post.date | date: "%a, %d %b %Y %H:%M:%S %z" }}</pubDate>
				<link>{{ site.url }}{{ post.url }}</link>
				<guid isPermaLink="true">{{ site.url }}{{ post.url }}</guid>
			</item>
		{% endfor %}
	</channel>
</rss>
```

*注意这里有使用部分_config.xml里的变量*

``` xml
---
layout: nil
title : Atom Feed
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
 
 <title>{{ site.title }}</title>
 <link href="{{ site.url }}/atom.xml" rel="self"/>
 <link href="{{ site.url }}"/>
 <updated>{{ site.time | date_to_xmlschema }}</updated>
 <id>{{ site.url }}</id>
 <author>
   <name>{{ site.author.name }}</name>
   <email>{{ site.author.email }}</email>
 </author>

 {% for post in site.posts %}
 <entry>
   <title>{{ post.title }}</title>
   <link href="{{ site.url }}{{ post.url }}"/>
   <updated>{{ post.date | date_to_xmlschema }}</updated>
   <id>{{ site.url }}{{ post.id }}</id>
   <content type="html">{{ post.content | xml_escape }}</content>
 </entry>
 {% endfor %}
</feed>
```

*注意这里有使用部分_config.xml里的变量*

##搜索和评论服务

搜索用的google:

``` html
<form class="search" method="GET" action="https://www.google.com.hk/search">
  <input type="text" name="as_q" class="search-query" placeholder="Search">
  <input type="hidden" name="as_sitesearch" value="chemzqm.me">
</form>
```

样式是由[angularjs.org](angularjs.org)借鉴过来的（感谢），另加了动画和阴影。

评论用的是Disqus（因为没有找到国内提供静态页面评论服务的提供商）
``` javascript
function _load(src, callback){ //load script file async
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = src;
  script.onload = callback;
  document.getElementsByTagName('HEAD')[0].appendChild(script);
}
_load('http://{{site.disqus_name}}.disqus.com/embed.js');
```

*注意这里有使用部分_config.xml里的变量*

##站点地图

创建站点地图索引文件可以有效的帮助搜索引擎找到你的文章, 具体用法请参考[google的文章](http://support.google.com/webmasters/bin/answer.py?hl=zh-Hans&answer=71453), sitemap可以支持多种格式，我这里还是用的xml：
``` xml
---
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    {% for post in site.posts %}
    <url>
      <loc>{{ site.url }}{{ post.url }}</loc>
        <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
        <changefreq>monthly</changefreq>
    </url>
    {% endfor %}
</urlset>
```

##定制页面

写了两个分类的页面，一个是按时间分类的 [archive.html](http://chemzqm.github.io/archive.html)，另一个是按tag分类的 [tags.html](http://chemzqm.github.io/tags.html).  两个页面模板代码差不多，例如tags.html：
``` html
---
layout: default
title: 按标记归档
---
<ul id="tagbox" class="clearfix">
{% for tag in site.tags %} 
  <li><a href="{{ BASE_PATH }}/tags.html#{{ tag[0] }}-ref">
    {{ tag[0] | join: "/" }} <span>{{ tag[1].size }}</span>
  </a></li>
{% endfor %}
</ul>

{% for tag in site.tags %} 
  <h2 id="{{ tag[0] }}-ref">{{ tag[0] | join: "/" }}</h2>
  <ul>
    {% assign pages_list = tag[1] %}  
    {% for node in pages_list %}
      {% if node.title != null %}
        {% if group == null or group == node.group %}
          {% if page.url == node.url %}
          <li class="active"><a href="{{ BASE_PATH }}{{node.url}}" class="active">{{node.title}}</a></li>
          {% else %}
          <li><a href="{{ BASE_PATH }}{{node.url}}">{{node.title}}</a></li>
          {% endif %}
        {% endif %}
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
```

##配置文件

``` yaml
name: jack's blog

author:
  name: Qiming Zhao
  email: chemzqm@gmail.com
  github: chemzqm

description: blog of jack(chemzqm)
#google analysis track id
track: UA-22751097-2 
disqus_name: zqm
url: http://chemzqm.me
markdown: rdiscount
pygments: true
```

其中前面的参数用做变量，可在其它文件中使用`{{ site.name }}`来引用。后面两个是jekyll运行参数，具体请参考[官方文档](https://github.com/mojombo/jekyll/wiki/Configuration)

尽管使用jekyll来扩展功能不像wordpress中安装插件那样的方便，但是代码的加入和编写的过程完全可控，不必理会操作数据库的繁琐操作，同时liquid模板的可读性相比php要高的多，结果就是管理者在修改的时候有章可循，很大程度降低了维护的成本。

如果你感兴趣，可以到[github](https://github.com/chemzqm/chemzqm.github.com)上下载本站的最新源代码。

