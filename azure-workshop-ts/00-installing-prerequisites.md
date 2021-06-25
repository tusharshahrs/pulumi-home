# Installing Prerequisites

The hands-on workshop will walk you through various tasks of managing Azure infrastructure with the focus on serverless compute and managed Azure services. The prerequisites listed below are required to successfully complete them.

## Install Visual Studio Code
   Install [visual studio code](https://code.visualstudio.com/download)

### Node.js

You will need Node.js version 14 or later([16](https://nodejs.org/en/about/releases/)) to run Pulumi programs written in [TypeScript](https://www.typescriptlang.org/).
Install your desired LTS version from [the Node.js download page](https://nodejs.org/en/download/) or
[using a package manager](https://nodejs.org/en/download/package-manager/).

After installing, verify that Node.js is working:

```bash
$ node --version
v14.17.1
```

or

```bash
$ node --version
v16.1.0
```

### Azure Subscription and CLI

You need an active Azure subscription to deploy the components of the application. You may use your developer subscription, or create a free Azure subscription [here](https://azure.microsoft.com/free/).

Please be sure to have administrative access to the subscription.

You will also use the command-line interface (CLI) tool to log in to an Azure subscription. You can install the CLI tool, as described [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).

After you complete the installation, open a command prompt and type `az`. You should see the welcome message:

```bash
az
     /\
    /  \    _____   _ _  ___ _
   / /\ \  |_  / | | | \'__/ _\
  / ____ \  / /| |_| | | |  __/
 /_/    \_\/___|\__,_|_|  \___|


Welcome to the cool new Azure CLI!
```

### Pulumi

You will use Pulumi to depoy infrastructure changes using code. [Install Pulumi here](https://www.pulumi.com/docs/get-started/install/). After installing the CLI, verify that it is working:

```bash
pulumi version
v3.5.1
```

The Pulumi CLI will ask you to login to your Pulumi account as needed. If you prefer to signup now, [go to the signup page](http://app.pulumi.com/signup). Multiple identity provider options are available &mdash; email, GitHub, GitLab, or Atlassian &mdash; and each of them will work equally well for these labs.

Setup your AccessToken
- Navigate to **Profile Settings** by selecting your avatar, then **Settings**. The Profile tab is displayed by default. ![Profile Image](https://www.pulumi.com/images/docs/reference/service/user-profile-page.png)
- Click on [Access Tokens](https://www.pulumi.com/docs/intro/console/accounts/#access-tokens) on the left side. Create a new *AccessToken*. Copy the AccessToken to your clipboard to use in the next step.
- On your cli: pulumi login
   - Enter your *AccessToken* from the previous step.