#!/bin/bash
if [ "$#" -lt 2 ]
then
  echo "USAGE: runtests browserProfileToRunIn http://sometesturl/ [optional:testgroup/folder]"
  exit 1
fi

set -e # Exit on error

ROOTDIR="$( cd "$( dirname "$0")" && pwd )"
cd $ROOTDIR

if [ ! -f $ROOTDIR/node_modules/.bin/mocha  ]; then
    echo "ERROR; MISSING FILES: Please run 'npm install' to install test framework and dependencies"
	exit 1
fi

phantomJsExe='phantomjs.exe' # Phantomjs default in path

export TESTSERVICE_USER='' # NOTE: enter your own
export TESTSERVICE_ACCESSKEY='' # NOTE: enter your own

export testprofiles=./testprofiles/browserstack # Which webdriverjs cloud service configuration to use for tests
export timeout=12000 # Timeout for webdriver
export testenv=$1
export testurl=$2
export testgroup=$3

# If applicable PhantomJS version
if [ "$1" == "phantomjs" ]
then
	phantomJsVersion=$($phantomJsExe --version)
	echo "PhantomJS version $phantomJsVersion"

	# Finding any old running Phantomjs
	oldpid=$(ps -e | grep 'phantomjs' |grep -v grep| awk '{print $1}')

	pidexists=${#oldpid}
	if [ $pidexists -gt 0 ]
	then
	  echo "PhantomJS already running on PID: $oldpid. Restarting..."
	  kill $oldpid
	fi

	$phantomJsExe --webdriver=8001 --webdriver-loglevel=SEVERE 2>&1 # TODO: Ghostdriver needs to be loaded with an absolute path; --webdriver-ghostdriverpath=c:\git\devops\utils\phantomjs\lib\ghostdriver
	pid1=$!
	echo "PhantomJS is now running using PID: $pid1"
fi

./node_modules/.bin/mocha --reporter spec --timeout 180000 run-yadda.js

# If phantomjs might be running
if [ "$1" == "phantomjs" ]
then
	kill $pid1 #Clean up
	echo "PhantomJS stopped."
fi

exit $?
