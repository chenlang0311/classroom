all: classroom-cli

check_env:
	@if [ "$(TARGET_DIR)" = "" ]; then echo "ERROR: TARGET_DIR was not set"; exit 1; fi
	@if [ "$(TAG_VERSION)" = "" ]; then echo "ERROR: TAG_VERSION was not set"; exit 1; fi
	@if [ "$(REGISTRY)" = "" ]; then echo "ERROR: REGISTRY was not set"; exit 1; fi

classroom-cli:check_env
	test -e node_modules || cnpm install
	npm run build

install:check_env
	rm -rf $(TARGET_DIR)/classroom-cli
	mkdir -p $(TARGET_DIR)/classroom-cli/app/html
	cp -r docker/* $(TARGET_DIR)/classroom-cli
	cp -r dist/* $(TARGET_DIR)/classroom-cli/app/html
	cp package.json $(TARGET_DIR)/classroom-cli/app
	cp -r node_modules $(TARGET_DIR)/classroom-cli/app

image:check_env
	cd $(TARGET_DIR)/classroom-cli && sudo docker build . -t $(REGISTRY)/project/classroom/classroom-cli:$(TAG_VERSION)

.PHONY: clean
clean:
	rm -rf node_modules