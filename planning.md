# Planning our application

1. Answer Questions
    - What are we building?
    - Who are we building it for?
    - What features do we need to have ?
2. User Stories
3. Think through the pages we need in our application
4. Model our Data



## Questions

1. What are we building ? We are building a blog website where we can blog.
2. Who are we building it for? We are building it for building it for [**Tourepedia**](http://www.tourepedia.com) company which is a _Complete Tour Planning_ company. We are building it for people who wants to know about places, wants to get inspired by stories of visitors. We want to get attention of potential visitors.
3. What features do we need to have?
    - Posts
        + Create / Edit / Destroy
        + Markdown feature for creating
        + Syntax highlighting
        + Comments (Disqus)
        + Share posts
        + Search posts by name
    - Contact
        + Contact form

## User stories

- **Author**
    + I want to be able to sign in and sign up.
    + I want to be able to view my profile, my all posts, my followers.
    + I want to be able to create posts so that I can share my thoughts.
    + I want to be able to edit & destroy my post so that I can manage my posts.
    + I want to be able to write post in markdown format so that it's easy for me to write posts.

- **User**
    + I want to be able to comment, like and share posts.
    + I want to able to contact for any feedback.
    + I want to be able to view tour plans for the current place, related to which I am reading the post.
    + I want to be able to search for a post by its title.
    + I want to be able to see profile of a author and be able to follow an author by adding an email (authentication) or by sign-in.
    + I want to be able to view post for a tag.
    + I want to be able to subscribe for posts notification.


## Think through the pages that we need in our application

- Posts
    - Index
    - Show
- Authors
    - Show
    - Profile
    - Posts
        - New
        - Edit
        - Manage


## Modeling out Data

- **Posts**
    + title:string
    + content:text
    + created_at:date
    + author:string
- **Authors**
    + email:string
    + password:string
    + name:string
- **Subscribers**
    + name:string
    + email:string

