# Introduction

### What is RBAC ?

Role Based Access Control (RBAC) is an access control pattern that governs the way users access applications based on the roles they are assigned. Roles are essentially groupings of permissions to perform operations on particular resources. Instead of assigning numerous permissions to each user, RBAC allows users to be assigned a role that grants them access to a set of resources. For example, a role could be something like evilGenius, or a sidekick. A sidekick like Morty Smith for example could have the permission to gather mega seeds, and an evilGenius like Rick would be able to create a microverse.

### What will we do ?

In this post, we'll review some of the ways to implement an RBAC pattern in a Node.js application using several open source libraries as well as the Aserto Express.js SDK. This is by no means an exhaustive guide for all the features the libraries provide, but it should give you a good idea of how to use them.
