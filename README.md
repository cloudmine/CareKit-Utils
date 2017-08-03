# Getting Started

CloudMine's CareKit offering is a composition of our ACL framework, User Management service, and our Business Logic engine. In order to begin synchronizing CareKit event and activitiy data, some initial environment configuration is required. This script will pre-configure these environment components for you, and from there it may be customized as needed based on business requirements. 

Before running the script, you will need the following pieces of information:

#### `Master API Key`

The `Master API Key` may be obtained from the Compass dashboard. 

#### `App Id`

The `App Id` may be obtained from the Compass Dashboard.

#### `Administrator Email`

The `Administrator email` is used for configuring the root admin user for the CareKit framework. This ACL is used to define which users have full access and visibility into all patient data. 

#### `Administrator Name`

The `Administrator Name` is a human-friendly name for the CareKit administrator. 


#### `Administrator Password`

The `Administrator Password` is required for securing the Admin user login. This should be a complex password, with multiple types of special characters and a mixture of upper and lower-case letters. 

#### `Local Snippet Path`

The `Local Snippet Path` defines where the configuration script can find the example Snippet. This Snippet may be customized in order to accomplish any business-level requirements as it relates to analytics, audit, or other custom use cases. The script will automatically insert the `ACL Id` and the environment configuration details for you. If the example snippet is changed, the script may fail. For most folks, the snippet path should be: `./Example.js` if you are running this script in the GitHub directory that was cloned. 

#### `Name of Snippet on CloudMine`

Once the `Example.js` file is prepared, it will be uploaded to CloudMine with a name of your choosing. This parameter allows you to define how this snippet will be named once deployed on CloudMine. 

# Usage instructions:

1) Run: `npm install`
2) Run: `node initCareKit.js -k \<Master-Api-Key> -a \<App-Id> -e \<Admin-Email> -n \<Admin-Name> -p \<Password> -l \<Path-to-Snippet> -s \<Name-of-Snippet-on-CloudMine>`

# Example usage:

```node initCareKit.js -k 7edcbb535f0629498b3f517631a02620 -a 968a20595dca3m2kfe2ab01526a79f17 -e ck_admin@cloudmineinc.com -n "CK Admin" -p abcd1234 -l ./Example.js -s CareKitUtils```
