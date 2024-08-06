BUILD_TAG ?= latest

build:
	docker build -t c2dhunilu/ww2:${BUILD_TAG} \
		--build-arg GIT_TAG=$(shell git describe --tags --abbrev=0 HEAD) \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_REVISION=$(shell git rev-parse --short HEAD) . &&  \
	docker run -it --rm c2dhunilu/ww2:latest cat version.json