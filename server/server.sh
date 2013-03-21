#! /bin/sh

cd `dirname $0`

# check dependencies
command -v composer >/dev/null 2>&1 || { echo >&2 "Error: composer is not installed."; exit 1; }
command -v beanstalkd >/dev/null 2>&1 || { echo >&2 "Error: beanstalkd is not installed."; exit 1; }
command -v ant >/dev/null 2>&1 || { echo >&2 "Error: ant is not installed."; exit 1; }

# kill old processes
if ps aux | grep "beanstalkd" > /dev/null
	then
	echo "Killing old beanstalkd process"
	killall beanstalkd
fi

if ps aux | grep "php" > /dev/null
	then
	echo "Killing old php process"
	killall php
fi

# dump autoload
composer dump-autoload --optimize

# start queue
beanstalkd &
php artisan queue:listen --timeout 300 & #job times out after 5 minutes



# build java lib
echo "Building java libs"
cd "./app/controllers/services/image/lib/zxing/javase"
ant


echo "Server running..."