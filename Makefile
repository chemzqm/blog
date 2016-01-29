MARKED := ./bin/marked
HOME := ./bin/home
SRCDIR := src
HTMLDIR := public
REMOTE := chemzqm@chemzqm.me

SRCFILES := $(shell find $(SRCDIR) -type f)
HTMLFILES := $(patsubst $(SRCDIR)/%,$(HTMLDIR)/%.html,$(SRCFILES))
CWD := $(shell pwd)

all: $(HTMLFILES) public/index.html

$(HTMLDIR)/%.html : $(SRCDIR)/% template.html
	@cat $< | $(MARKED) template.html > $@

public/index.html: index.html $(SRCFILES)
	@$(HOME) $^

remote: all
	@git add .
	@git commit -a -m 'build' > /dev/null || echo 'clean'
	@git push me master

clean:
	@rm -rf $(HTMLFILES) public/index.html

.PHONY: all clean remote
