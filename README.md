### LMS
The corporate library application which will help corporate users order  books in their desks.

### Modules
1. Admin Modules - The Admin  & Super Admin user only has access.
   * Super Admin => They can create `corporate users `and they can review all books, users and corporates.
   * Admin(Corporate Admin) => The can create `employee users` and user can create books.
2. Book Modules - The `Employee user` can checkin books and order books.
### How to run application?

#### Prerequisite
1. Install rvm
2. Install mysql
3. Install yarn

#### Steps
1. rvm use 3.1.3
2. rvm create gemset lms
3. rvm use 3.3.3@lms
4. bundle install
5. yarn install 
6. rails db:create
7. rails db:migrate
8. rails db:seed
9. ./bin/dev
10. Run application in browser : (http:127.0.0.1:3000) which will navigate to dashboard.

### How to run api?
1. Run server: `./bin/dev`
2. Hit the 
```
http://127.0.0.1:3000/api/v1/authors
http://127.0.0.1:3000/api/v1/authors/{:id}
http://127.0.0.1:3000/api/v1/books
http://127.0.0.1:3000/api/v1/books//{:id}
http://127.0.0.1:3000/api/v1/categories
http://127.0.0.1:3000/api/v1/categories/{:id}
http://127.0.0.1:3000/api/v1/corporates
http://127.0.0.1:3000/api/v1/corporates/{:id}
http://127.0.0.1:3000/api/v1/subcategories
http://127.0.0.1:3000/api/v1/subcategories/{:id}
http://127.0.0.1:3000/api/v1/publishers
http://127.0.0.1:3000/api/v1/publishers/{id}
http://127.0.0.1:3000/api/v1/users
http://127.0.0.1:3000/api/v1/users/{id}
```

### Issues
1. Please attach issues description and solution here.
