# Setup

The code examples shown below can be found in this repository. To run each of them, navigate to the corresponding directory and run yarn install followed by yarn start.

All of the examples we'll demonstrate in this post have a similar structure:

1- They use Express.js as the web server, and they use a middleware called hasPermission to check if the user has the correct permissions to access the route.

2- They share a users.json file that contains the users and their assigned roles. This file will simulate a database that would be used in a real application to store and retrieve user information.

*LOOK IN "CODE" FOLDER ^^*

The users.json file is going to be accessed by a function called resolveUserRole which, given a user will resolve their role. This function is shared by all of the examples and is found in utils.js.

*LOOK IN CODE FOLDER*

The initial setup for the Express.js app is straightforward:

*CODE*

The application will have three routes that will be protected by the hasPermission middleware, which will determine whether the user has the correct permissions to access the route, based on the action associated with that route

*CODE*

And finally, the application will listen on port 8080:

*CODE*

### Testing

To test the application, we'll make a set of requests to the routes and check the responses:

*CODE/TESTING*

Where <HTTP Verb> is either GET, PUT, or DELETE and <asset> is either megaSeeds or timeCrystals.

For each user, we'll expect the following:

Beth (AKA the clone): Should be only able to gather megaSeeds and timeCrystals

Morty (AKA the sidekick): Should be only able to gather and consume megaSeeds and timeCrystals

Rick (AKA the evilGenius): Should be able to gather, consume and destroy only megaSeeds and timeCrystals.

Let's go get those mega seeds!
  
### Vanilla Node.js

To set the scene, we start with the most simplistic way of enforcing roles in a Node.js application. In this example, we're going to use a JSON file (roles.json) that will map specific roles to actions they may perform, and assets they may perform those actions on:
  
  *CODE/VANILLANODEJS*

In this JSON snippet, the clone role will only be able to gather the megaSeeds and timeCrystals assets. The sidekick role will be able to gather and consume the megaSeeds and timeCrystals assets. The evilGenius role will be able to gather, consume, and destroy megaSeeds and timeCrystals.

The implementation of the hasPermission middleware function is going to be very simple:
  
  *CODE/VANILLANODEJS*

  In this example we:

- Iterate over each user role

- Check the existence of the user's given role in the roles object

- Check the existence of actions within that given role, and finally check if the assets array associated with that role and action contains the asset the user is trying to access.
Determine whether the permissions the user has included the asset they are trying to access.

Other than being pretty simplistic, this approach is not going to be very scalable - the "policy" definition is going to become complex, highly repetitive, and thus hard to maintain.
  
### Node Casbin
  
Casbin is a powerful and efficient open-source access control library. It has SDKs in many languages, including Javascript, Go, Rust, Python, and more. It provides support for enforcing authorization based on various access control models: from a classic "subject-object-action" model, through RBAC and ABAC models to fully customizable models. It has support for many adapters for policy storage.

In Casbin, the access control model is encapsulated in a configuration file (src/rbac_model.conf):
  
  *CODE/NODECASBIN*

Along with a policy/roles definition file (src/rbac_policy.conf)
  
  *CODE/NODECASBIN*
  
The request_definition section defines the request parameters. In this case, the request parameters are the minimally required parameters: subject (sub), object (obj) and action (act). It defines the parameters' names and order that the policy matcher will use to match the request.

The policy_definitions section dictates the structure of the policy. In our example, the structure matches that of the request, containing the subject, object, and action parameters. In the policy/roles definition file, we can see that there are policies (on lines beginning with p) for each role (clone, sidekick, and evilGenius)

The role_definition section is specific to the RBAC model. In our example, the model indicates that an inheritance group (g) is comprised of two members. In the policy/roles definition file, we can see two role inheritance rules for sidekick and evilGenius, where sidekick inherits from clone and evilGenius inherits from sidekick (which means the evilGenius will also have the clone permissions).

The matchers sections defines the matching rules for policy and the request. In our example, the matcher is going to check whether each of the request parameters matches the policy parameters and that the role r.sub is in the policy.
  
The implementation of the hasPermission middleware function for Node-Casbin is as follows:
  
  *CODE/NODECASBIN*

In this code snippet, we create a new Casbin enforcer using the newEnforcer function. Then, we call e.enforce(role, asset, action) on each user role, and return true as soon as the result of the e.enforce function is true. We return a 403 Forbidden response if the user is not allowed to perform the action on the asset, otherwise, we call the next function to continue the middleware chain.
  
### CASL

The CASL library is an isomorphic authorization that's designed to be incrementally adoptable. Its aim is to make it easy to share permissions across UI components, API services, and database queries. CASL doesn't have the concept of a role - it can only assign a set of permission to a user. It is the responsibility of the developer to handle to the assignment of the proper permissions to a user based on their assigned roles. Instead, CASL permissions are defined as tuples of "action", "subject", "conditions" and optionally "fields".

The main concept in CASL is the "Abilit
  
It uses a declarative syntax to define abilities, as seen below:
  
  *CODE/CASL*
  
In this code snippet, we resolve the user's role using the same resolveUserRoles utility function. Since CASL doesn't have the notion of a role, we create a switch statement that handles the assignment of permission for the various roles. For each role we call the can function which assigns a particular action (gather, consume, or destroy) to a particular resource model (Asset) with specific conditions (id has to equal the asset specified). In the case of the evilGenius role, we use the reserved manage keyword - which means the user can perform all actions, and the reserved all keyword that indicates that this role can do execute actions on all assets.

The hasPermission middleware function for CASL is very similar to the one we used in the previous example:
  
  *CODE/CASL*
  
The ability is defined by the rules set by the defineRulesFor function. Then, we wrap the error handler ForbiddenError.from(ability)... that will throw unless that ability allows the user to perform the action on the asset we pass to it. If no error is thrown, we call the next function to continue the middleware chain, otherwise, we return a 403 Forbidden response.
  
### RBAC
  
The rbac library provides a simple interface for RBAC authorization. It provides an asynchronous interface for the storage of the policy and supports hierarchical roles.

The policy definition is a JSON object passed to the RBAC constructor:
  
  *CODE/RBAC*

This code snippet defines the possible roles used in the policy, the possible actions for each asset and eventually defines the mapping between the possible roles and the combination of actions and assets. The combination of actions and assets is simply the concatenation of the action string, an underscore, and the asset. We can see that sidekick also inherits the clone role, and evilGenius also inherits the sidekick role.

The hasPermission middleware function is again similar to the one we used in the previous examples, where the only difference is the call to the policy object:

  *CODE/RBAC*

### Access-Control

The Access-Control project offers a "Chainable, friendly API" with hierarchical role inheritance. It allows developers to define roles using a single definition file or using a chain of .can calls. It only supports the CRUD action verbs, with two ownership modifiers: any and own.

In this example, we define the roles and permissions in a file called grantlist.js:

  *CODE/AC*

As in the other examples, we have a mapping between roles, assets, and actions. Unlike the other examples, we are limited to the CRUD actions, and in our case, only read, update, and delete apply. As you'll see below, we mapped our custom actions (gather, consume and destroy) to the CRUD actions (it's a bit odd, but that's what you get when you build your authorization library only around CRUD actions...)

We also specify that the sidekick role will be able to readAny of the megaSeeds, but we also limit the attributes that can be read. Specifically, we allow the sidekick to access all the attributes except for the id attribute.

We import the grant list to our main application file, and initialize the AccessControl object:

  *CODE/AC*

In this case, instead of explicitly declaring all the roles and permissions, we can extend one role with another:

  *CODE/AC*

The hasPermission implementation is a bit different than the other libraries we reviewed so far.

  *CODE/AC*

In this code snippet, we switch over the action based on the CRUD verb associated with it. We then iterate over the userRoles array and collect the permissions for each role.

After collecting all the permissions, we iterate over them again and "fetch" any data the user has access to from a mock store (assets).

  *CODE/AC*

We then use the perm.filter method to filter the data such that only the allowed attributes are passed to the route function.

In this example, when we test the evilGenius user with the action gather on megaSeeds we'll get the following result:

  *CODE/AC*

Based on the grants definition above, the clone is not allowed to see the id attribute, but the evilGenius is allowed to see all the attributes.
  
# Application implementation

The hasPermission function implementation is mostly similar, except that we're not going to resolve the user roles, since Aserto will do that for us:

  *CODE/AI*

Here we pass the user's id as part of the req object. In production use cases, the req.user object would be populated after the user's authentication has been completed. The is function is going to return the allowed decision for the given route (encapsulated in the req object), for the asset we specify in the resource context.

The configuration passed to the is function (in the options object) requires that we create a .env file in the root of the project, and populate some environment variables from the Aserto console, on the Policy Details page:

Copy the Policy ID, Authorizer API Key, and Tenant ID to the .env file:

  *CODE/AI*

To run the example, run the following commands in the aserto directory:

  *CODE/AI*

Finally, you can test the application by running the same curl commands as before:

  *CODE/AI*
