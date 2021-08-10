#!/usr/bin/env bash

args=(-o /bin/app)

if [[ ${RACE_DETECTOR} -eq "1" ]]; then
	CGO_ENABLED=1
    args+=(-race)
fi

cd /app
go build "${args[@]}" ${BUILD_ARGS}
/bin/app ${RUN_ARGS}