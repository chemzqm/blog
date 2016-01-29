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
	@rsync -rvz -e 'ssh -p 302' $(CWD) $(REMOTE):/home/chemzqm

clean:
	@rm -rf $(HTMLFILES) public/index.html

.PHONY: all clean remote
