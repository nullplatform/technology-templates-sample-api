# Nullplatform Sample Application Tutorial

In this tutorial, we'll guide you through the process of creating a JavaScript application using Fastify that searches for movies using the OMDB API. As we go through the tutorial, we'll also explore nullplatform's UI and show you how to use it to deploy and manage your application.

By the end of the tutorial, you'll have a fully functional application that you can customize deplot and play. Let's get started!

> **Important**: Before you begin this tutorial, please ensure that you have:
> 1) A [nullplatform](https://www.nullplatform.com) account that works in your organization or you can request access to our [sandbox](sandbox@nullplatform.io) and we'll email you the credentials.
> 2) An [OMDB API](https://www.omdbapi.com/apikey.aspx) access token. 

We're going use [nullplatform](https://www.nullplatform.com) to:

* Create Github repository based on this template.
* Setup CI & Building pipeline that runs tests, produces a Docker image and pushes it to ECR.
* Create the necessary infrastructure to release the application to production.
* Configure the application using environment variables.
* Browse and search application logs.
* Analyze performance metrics
* Browse custom (business) metrics.


But don't worry, as complex as it may sound, this is going to be super straightforward and fast. In less than 10 minutes you'll be playing with the deployed app. 

## Create an new application
__Name your aplication__:
The first step is to give your new application a name. This can be anything you like, but make sure it's descriptive and unique. Once you've decided on a name, enter it into the application name field.

__Pick the right template__:
When creating a new application, it's important to start with a solid foundation. That's where templates come in. Templates are pre-built structures that provide a meaningful starting point for your application.

For this tutorial, we'll be using the ___Tutorial: Movie Search Application___ template, which is specifically designed to guide you through _nullplatform_ features. This template includes some pre-built [fastify](https://www.fastify.io/) endpoints that will serve as an example and some logs and parameters that will serve to show-off _nullplatform features!_ .

Choose the ___Tutorial: Movie Search Application___ template from the list of available templates.

__Make sure you select *"Deploy application"*:__
Make surethe *"Deploy Application"* option is checked before clicking the *"Create Application" button. This will automatically deploy your application to your cloud infrastructure, making it available for use right away.

__Click *"Create Application"*:__
Once you click on *Create Application* your application will be running in your cloud account in minutes.

<img src="gifs/create_application.gif">

### You are all set! 
Congratulations! You've just created a brand-new application that will soon be up and running in production. During the creation process, a number of important things have happened, including:
* Brand-new infrastructure has been provisioned within your cloud provider, within a secure network that you control.
* Autoscaling, autohealing, and rightsizing have been provided out-of-the-box, along with automatic spotfleet selection that can deliver up to 50% cloud-cost savings automatically.
* A new private GitHub repository has been created that is owned by your GitHub organization.

After just a few minutes, your application will be fully operational and ready for use. We'll start customizing it to meet the demo needs, adding your own code, configurations and browsing logs and metrics.


<img src="gifs/finish_create_app.gif">


### Congratulations! 

your new application is up and running! Here are a few things you can do now:

* Explore the code in your new repository to get a better understanding of how it works and make any necessary changes.
* Access your application's landing page by clicking on the "View Application" button. From there, you can operate your application, including creating a new release, deploying it, and accessing logs and metrics.

Now that your application is up and running, you have full control over its development and operation.

<img src="gifs/browse_application.gif">

2) Configure parameters:
   1) Parameters needed by the application. 
   2) Setting up a parameter.
   3) Setting up a secret.
      1) Set up the OMBD API access token.
>VIDEO Explore the parametrization requirements in the sample app, configure parameters and secrets

3) Making a change:
   1) Adding a new Log.
   2) Commiting
>VIDEO Making changes and creating your own build.

4) Deploying the application:
   1) Creating a release.
   2) Deploying a release.
   3) Switching the traffic.

>VIDEO Release, Deploy, Switch traffic.

6) Using logs:
   1) Logs in the sample application: 
   2) Browsing logs
      1) Date filter
      2) Tail
   3) Searching logs
      1) Querying structured and non structured logs.

>VIDEO Explore logs-pretty print, search logs. 

7) Analyzing performance:

>VIDEO Analyzing performance.

8)Analyzing business metrics in the infrastructure context:

>VIDEO Review the code for existing custom metrics,








   


# Sample API Tutorial Application

This is a simple [Fastify](https://www.fastify.io/) application that showcases some of the [nullplatform](https://www.nullplatform.com) features. 

`GET /movie?name="top gun"`: Retrieves all the movies that contains `top gun` in it's title.

`PATCH /movie/:id/my`: Set your valuation for a movie.

`GET /movie/:id`: 

`GET /movie/:id/my`:

## Getting started


### Make sure you have a [nullplatform](https://www.nullplatform.com) account.

* If you don't have a nullplatform account you can [request one](https://nullplatform.com/signup).




### Create a new application in your [nullplatform](https://www.nullplatform.com) account.

* Make sure to deploy your application into a scope

### 

To install the application, simply clone the repository and run `npm install`:

```bash
git clone https://github.com/your-username/fastify-app.git
cd fastify-app
npm install
