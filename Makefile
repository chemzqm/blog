MARKED := ./bin/marked
HOME := ./bin/home
SRCDIR := src
HTMLDIR := public
REMOTE := chemzqm@chemzqm.me

SRCFILES := $(wildcard $(SRCDIR)/*)
HTMLFILES := $(patsubst $(SRCDIR)/%,$(HTMLDIR)/%.html,$(SRCFILES))
CWD := $(shell pwd)

all: $(HTMLFILES) public/index.html
	@chrome http://chemzqm.local/

$(HTMLDIR)/%.html : $(SRCDIR)/% template/post.html
	@cat $< | $(MARKED) template/post.html > $@

public/index.html: template/index.html $(SRCFILES)
	@$(HOME) $^

remote: all
	@git add .
	@git commit -a -m 'build' > /dev/null || echo 'clean'
	@git push me master

clean:
	@rm -rf $(HTMLFILES) public/index.html public/sitemap.xml

.PHONY: all clean remote
