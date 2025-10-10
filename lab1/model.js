let idForUser = 1;
let idForChat = 1;
let idForMessage = 1;
let idForPost = 1;
let idForComment = 1;


class PostLike {
    constructor(userId, postId, timestamp = new Date()) {
        this.userId = userId;
        this.postId = postId;
        this.timestamp = timestamp;
        this.compositeKey = `${userId}_${postId}`;
    }
}

class ChatUser {
    constructor(userId, chatId, joinedAt = new Date(), role = 'member') {
        this.userId = userId;
        this.chatId = chatId;
        this.joinedAt = joinedAt;
        this.role = role;
        this.compositeKey = `${chatId}_${userId}`;
    }
}


class User {
    constructor(username, email, bio = null, profilePicture = null) {
        this.userId = idForUser++;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.profilePicture = profilePicture;

        this.chats = [];       // ChatUser[]
        this.messages = [];    // Message[]
        this.posts = [];       // Post[]
        this.comments = [];    // Comment[]
        this.likedPosts = [];  // PostLike[]
    }

    addChat(chat) {
        const chatUser = new ChatUser(this.userId, chat.chatId);
        this.chats.push(chatUser);
        chat.users.push(chatUser);
    }

    addMessage(message) {
        this.messages.push(message);
    }

    addPost(post) {
        this.posts.push(post);
    }

    addComment(comment) {
        this.comments.push(comment);
    }

    likePost(post) {
        if (this.likedPosts.some(like => like.postId === post.postId)) return;
        const like = new PostLike(this.userId, post.postId);
        this.likedPosts.push(like);
        post.likes.push(like);
    }
}

class Chat {
    constructor(title, isGroup = false, avatar = null) {
        this.chatId = idForChat++;
        this.title = title;
        this.isGroup = isGroup;
        this.avatar = avatar;

        this.users = [];    // ChatUser[]
        this.messages = []; // Message[]
    }

    addUser(user) {
        const chatUser = new ChatUser(user.userId, this.chatId);
        this.users.push(chatUser);
        user.chats.push(chatUser);
    }

    addMessage(message) {
        this.messages.push(message);
    }
}

class Message {
    constructor(text, sender, chat, status = 'sent', timestamp = new Date()) {
        this.messageId = idForMessage++;
        this.text = text;
        this.status = status;
        this.timestamp = timestamp;

        if (!sender || !chat) throw new Error('Message requires a sender and a chat.');

        this.senderId = sender.userId; // FK
        this.chatId = chat.chatId;     // FK
    }
}

class Post {
    constructor(text, author, foto = null, date = new Date()) {
        this.postId = idForPost++;
        this.text = text;
        this.foto = foto;
        this.date = date;

        if (!author) throw new Error('Post requires an author.');

        this.authorId = author.userId; // FK
        this.comments = []; // Comment[]
        this.likes = [];    // PostLike[]
        this.commentCount = 0;
    }

    addComment(comment) {
        this.comments.push(comment);
        this.commentCount = this.comments.length;
    }

    addLike(user) {
        if (this.likes.some(like => like.userId === user.userId)) return;
        const like = new PostLike(user.userId, this.postId);
        this.likes.push(like);
        user.likedPosts.push(like);
    }
}

class Comment {
    constructor(text, author, post, date = new Date()) {
        this.commentId = idForComment++;
        this.text = text;
        this.date = date;
        this.likeCount = 0;

        if (!author || !post) throw new Error('Comment requires an author and a post.');

        this.authorId = author.userId; // FK
        this.postId = post.postId;     // FK
    }

    addLike() {
        this.likeCount++;
    }
}
