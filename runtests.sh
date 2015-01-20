#!/bin/bash
if [ "$#" -lt 2 ]
then
  echo "USAGE: runtests browserProfileToRunIn http://sometesturl/ [optional:testgroup/folder]"
  exit 1
fi

set -e # Exit on error

ROOTDIR="$( cd "$( dirname "$0")" && pwd )"
cd $ROOTDIR

export BROWSERSTACK_USER='' # NOTE: enter your own
export BROWSERSTACK_KEY='' # NOTE: enter your own

export timeout=10000 # Timeout for webdriver
export testenv=$1
export testurl=$2
export testgroup=$3

# If applicable PhantomJS version
if [ "$1" == "phantomjs" ]
then
	phantomJsVersion=$(phantomjs --version)
	echo "PhantomJS version $phantomJsVersion"

	# Finding any old running Phantomjs
	oldpid=$(ps -e | grep 'phantomjs' |grep -v grep| awk '{print $1}')

	pidexists=${#oldpid}
	if [ $pidexists -gt 0 ]
	then
	  echo "PhantomJS already running on PID: $oldpid. Restarting..."
	  kill $oldpid
	fi

	phantomjs --webdriver=8001 --webdriver-loglevel=SEVERE 2>&1
	pid1=$!
	echo "PhantomJS is now running using PID: $pid1"
fi

mocha --reporter spec --timeout 60000 run-yadda.js

# If phantomjs might be running
if [ "$1" == "phantomjs" ]
then
	kill $pid1 #Clean up
	echo "PhantomJS stopped."
fi

exit $?
