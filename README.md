# Nullplatform sample application tutorial

In this tutorial we'll guide you getting from zero to production with a fully functional application on nullplatform.

Our sample application will be a Node.js application that searches for movies using the [OMDB API](https://www.omdbapi.com/).

Before starting be sure to get:
- [ ] A nullplatform account for your organization ([request access to our sandbox](https://forms.gle/bmsZ3r51WQnofAw49) to get the credentials).
- [ ] An [OMDB API access token](https://www.omdbapi.com/apikey.aspx). 

In the next sections you'll command nullplatform to do these heavy-lifting tasks:

- Create a Github repository based on this application template,
- Set the CI & build pipeline,
- Create the infrastructure to release the application,
- Configure the application environment & secrets,
- Set up the log & telemetry infrastructure,
- Set up the cloud's networking, provisioning, and traffic management.

## Create an new application

<img src="gifs/create_application.gif">

#### Steps

1. Enter the application's name
   - this can be anything you like
   - make sure it's descriptive and unique

2. Pick the `Tutorial: Movie Search Application` template
   - This template includes some pre-built [fastify](https://www.fastify.io/) endpoints that will serve as an example plus logs and parameters that will serve to showcase nullplatform's capabilities.
   - Templates are pre-built repositories that provide a meaningful starting point for your application.
   - We don't have a suitable template for you? no worries, you still can deploy anything that runs on containers.

3. Make sure the `Deploy application` box is checked
   - This will automatically deploy your application to your cloud infrastructure, making it available for use right away.

4. Click on `Create Application` and wait for nullplatform to deploy your application.
<img src="gifs/finish_create_app.gif">

> **What's going on during the create application process?**
> * Brand-new infrastructure has been provisioned within your cloud provider, within a secure network that you control.
> * Autoscaling, autohealing, and rightsizing have been provided out-of-the-box, along with automatic spotfleet selection that can deliver up to 50% cloud-cost savings automatically.
> * A new private GitHub repository has been created that is owned by your GitHub organization.

### Congratulations! Your application is up and running!

Now that your application is up and running, you have full control over its development and operation.

#### Browse your application's dashboard

<img src="gifs/browse_application.gif">

#### Browse the application you've just deployed

<img src="gifs/goto_scope_domain_and_fail.gif">

To see the application live:

* Go to the `Scopes` section in the left-hand menu.
* You'll see the main scope there. Scopes are like clusters, you can create as many clusters as you want for your application. We'll explore this topic in more detail later on.
* Click on the `Domain` link in the main Scope card to access your new application.

#### Ooops! It looks like some configuration is needed!

When we browse our new application, we may receive an error response that looks like this:

``` json
{
   "message": "Either MOVIES_API_KEY or MOVIES_API_URL parameter is missing"
}
```
This error message indicates that our application requires some environment configuration to operate correctly. If we take a look at the `index.js` file, we can see that our application needs two environment variables to run properly:

```` javascript
/**
 * Read some operational configuration and secrets!
 */
const apiKey = process.env.MOVIES_API_KEY;
const apiUrl = process.env.MOVIES_API_URL;
````

To fix this issue, we need to provide valid values for `MOVIES_API_KEY` and `MOVIES_API_URL` environment variables. These variables contain sensitive information that should not be hard-coded into our code. We'll cover how to set up these variables in the next steps.

## Configuration Management: Parameters

#### Setting the `MOVIES_API_URL` environment variable

<img src="gifs/create_environment_url.gif">

To create the `MOVIES_API_URL` environment variable:

1) Navigate to the `Parameters` section in the left-hand menu and click on `+ New Parameter` button to create a new parameter
3) Choose a name for your parameter
4) Make sure the `environment variable` option is checked
5) Specify `MOVIES_API_URL` as the `Variable Name`
7) Select the `main` tab and enter the value like is shown in the animation above
8) Click `Create Parameter`

Now you have set up the `MOVIES_API_URL` parameter in nullplatform and your application will get it in the next deployment.

#### Setting the `MOVIES_API_KEY` secret variable

<img src="gifs/create_secret_key.gif">

Remember that you'll need to have an [OMDB API](https://www.omdbapi.com/apikey.aspx) key
 - Once you've registered for an API key, you'll receive an email that looks like this:
   <img src="gifs/ombd_email.png">
 - Copy the token from the URL provided in the email and don't forget to validate your email by clicking the link below it.

Follow these steps to set up the `MOVIES_API_KEY` parameter as a secret in nullplatform:

1) Check your inbox and copy your API token
2) Follow the same steps as before, but replace the parameter and variable names with appropriate ones.
3) **Check the `Set value as secret` option**.
4) Click on `Create Parameter`.

> **Secrets.** By setting the `MOVIES_API_KEY` parameter as a __Secret__, we ensure that sensitive information is not displayed in plain text in our code or frontend. This is an important step to take when managing configuration parameters that contain sensitive information. From now on, we can only change this parameter, but never read it again from the UI, ensuring maximum security for our application.

## Making changes to the application

<img src="gifs/change_code.gif">

Let's now make a change in the application, we'll deploy it to production later on.

### Editing the code

Finding the GitHub repository on nullplatform:
1) Navigate to the `Dashboard` section
2) In the `Quick information` card click on the `Repository` link

Editing code on GitHub:
1) Open `index.js`.
2) Edit the file by clicking on the pencil in the upper right corner of the page
3) Locate the TODO section in the code and uncomment the `console.log(...)` line:
``` javascript
    try {
        //TODO: Uncomment this code =)
        //console.log(`Searching for ${searchString}`);

        if (!moviesService) {
        ...
```
4) Scroll to the bottom of the page and click the `Commit changes` button.

Now your change has been committed and a new build is in progress. Follow the next section to create a release and deploy the changes.

### Deploy the changes

To deploy we have to first create a release in nullplatform:

1) Navigate to the `Build` section in the left-hand bar
2) Locate the build based on the commit you recently made and wait for the build to be `finished`.
4) On the build's row, click the `+ New release` button
5) Enter a version number release (in the shape of `x.y.z-text`, check [semantic versioning](https://semver.org/lang/es/) ).
6) Click the `Create Release` button.

<img src="gifs/create_release.gif">

#### Start a deploy on live infrastructure

<img src="gifs/initiate_deploy.gif">

#### Move traffic between Releases

<img src="gifs/move_traffic_and_finish.gif">

#### Check your changes live

<img src="gifs/working_app.gif">

## Logs

<img src="gifs/browse_logs.gif">

<img src="gifs/search_logs.gif">
   
## Performance

<img src="gifs/performance_metrics.gif">

## Business Metrics

>VIDEO Review the code for existing custom metrics,

## Sample application's API

- Search for all the movies that contains `top gun` in it's title: `GET /movie?name="top gun"`

- Get the movie details by ID: `GET /movie/:id`

- Get your valoration for a movie `GET /movie/:id/my`

- Set your valoration for a movie `PATCH /movie/:id/my`

## Appendix: running the application locally

To run and edit the application locally run these commands:

```bash
git clone https://github.com/your-username/fastify-app.git
cd fastify-app
npm install
npm start
```

Now you can browse the application in your browser.

