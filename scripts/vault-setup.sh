#!/usr/bin/env bash

cd "${0%/*}"

source ./setenv-common.sh local
if [ $? != 0 ]; then [ $PS1 ] && return || exit; fi

export VAULT_TOKEN=$(eval $VAULT_TOKEN_CMD)

EXISITING_AUTH=$(vault auth list -format=json | jq -r ".[\"$VAULT_APPROLE_PATH/\"]")

if [[ "null" != "$EXISITING_AUTH" ]]
then
  echo "Already setup! Exiting..."
  exit
fi

echo "Setting up: $VAULT_ADDR"

vault auth enable -path $VAULT_APPROLE_PATH approle
echo "path \"*\" {  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\", \"sudo\"]}" | vault policy write broker-policy -
vault write auth/$VAULT_APPROLE_PATH/role/$VAULT_BROKER_ROLE policies=broker-policy
vault write -force auth/$VAULT_APPROLE_PATH/role/$VAULT_AUDIT_ROLE

vault write -force auth/$VAULT_APPROLE_PATH/role/jenkins_jenkins-isss_prod policies=default
vault write -force auth/$VAULT_APPROLE_PATH/role/fluent_fluent-bit_prod policies=default

vault audit enable file file_path=/tmp/my-file.txt