Prerequisite s/w - Node, Ionic, Cordova

Note - use sudo in mac,linux (if any error occured while installation)
1.) Install NODE (from https://nodejs.org/en/download/ )
2.) Open Terminal and Enter following command 
	a)	`npm install -g ionic@latest`
	b)	`npm install -g cordova`

3.) Extract zip file(source code)
4.) In Terminal navigate to ROOT DIR of Source code and Enter command
	a)	`sudo npm install`
	b)	`sudo ionic cordova platform add ios`
	c)	`sudo ionic cordova build ios --prod`
5.) Go to ROOT/platform/ios and open .xcworkspace file in xcode and make build(archive/ipa) from any developer account