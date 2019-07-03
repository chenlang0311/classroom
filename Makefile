include Rules.mk
all: echo-env api crm cli

install: api-install crm-install cli-install 
image: api-image crm-image cli-image 

echo-env:
	@echo "TARGET_DIR=$(TARGET_DIR)"
	@echo "TAG_VERSION=$(TAG_VERSION)"
	@echo "REGISTRY=$(REGISTRY)"

api:
	$(MAKE) -C classroom-api
api-install:
	$(MAKE) -C classroom-api install
api-image:
	$(MAKE) -C classroom-api image

crm:
	$(MAKE) -C classroom-crm
crm-install:
	$(MAKE) -C classroom-crm install
crm-image:
	$(MAKE) -C classroom-crm image



cli:
	$(MAKE) -C classroom-cli
cli-install:
	$(MAKE) -C classroom-cli install
cli-image:
	$(MAKE) -C classroom-cli image

cleanall:crm-clean  cli-clean  
	rm -rf $(TARGET_DIR)

api-clean:
	$(MAKE) -C classroom-api clean
crm-clean:
	$(MAKE) -C classroom-crm clean
cli-clean:
	$(MAKE) -C classroom-cli clean