PATH := ./node_modules/.bin:$(PATH)
NODE_PATH := lib:$(PATH)

CHECK=\033[32m✔\033[39m
BUILD ?= public/build
JS_LIB ?= public/js/lib
CSS_FILES ?= $(shell find public/styles -name '*.css')
JS_FILES ?= $(shell find public/js -name '*.js')
JADE_FILES ?= $(shell find lib -name '*.jade')
STYLE_CSS ?= public/styles/style.css
BUILD_CSS ?= public/build/build.min.css
BUILD_JS ?= public/build/build.min.js

start: blog.pid tiny-lr.pid

$(STYLE_CSS): public/styles/style.styl
	@notify-send "$? has changes. Compile"
	@stylus -l -u ./node_modules/nib $?


$(BUILD_CSS): $(CSS_FILES)
	@cat $^ > public/build/build.css
	@cssmin public/build/build.css > $@
	@notify-send "$? has changed. Reload"
	sleep 0.500
	curl -X POST http://localhost:35729/changed -d '{ "files": "$?" }'

$(BUILD_JS): $(JS_FILES)
	@cat ${JS_LIB}/respond.js ${JS_LIB}/html5shiv.js > ${BUILD}/ie.js
	@uglifyjs ${BUILD}/ie.js > ${BUILD}/ie.min.js
	@uglifyjs ${JS_LIB}/editor.js > ${BUILD}/editor.min.js
	@notify-send "$? has changed. Reload"
	@touch $@
	sleep 0.500
	curl -X POST http://localhost:35729/changed -d '{ "files": "$?" }'

$(BUILD): $(JADE_FILES)
	@notify-send "$? has changed. Reload" 
	@touch $@
	sleep 0.500
	curl -X POST http://localhost:35729/changed -d '{ "files": "index.html" }'

blog.pid:
	@node-dev app.js & echo "$$!" > blog.pid
	@echo -e "${CHECK} server started..."
	@google-chrome http://localhost:$$PORT

tiny-lr.pid:
	@tiny-lr > /dev/null &
	@echo -e "${CHECK} liveload server started..."

stop-server:
	@$(shell [ -f blog.pid ] && kill `cat blog.pid` && rm blog.pid)
	@echo -e "${CHECK} server stopped ..."

stop-tinylr:
	@$(shell [ -f tiny-lr.pid ] && kill `cat tiny-lr.pid`)
	@echo -e "${CHECK} tiny-lr server stopped ..."

stop: stop-server stop-tinylr

compile: $(STYLE_CSS) $(BUILD_CSS) $(BUILD_JS) $(BUILD)

clean:
	rm -f public/build/*

.PHONY: start stop clean
