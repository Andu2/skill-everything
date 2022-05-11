While designing this app, I wanted to make it as easy as possible to write new content without having to edit any internals.
But I also wanted to use TypeScript, and I kept having issues with having to import types and such upstream, which is annoying.
I wanted to "register" the content at runtime, but TypeScript only checks types at compile time.
