const express = require('express');
const redis = require('redis');
const cors = require('cors');
const util = require('util');
const axios = require('axios');

const app = express();

const client = redis.createClient({
  url: "redis://127.0.0.1:6379",
  legacyMode: true
})

client.set = util.promisify(client.set);
client.get = util.promisify(client.get);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});



(async () => {
  await client.connect();
})();

client.on('connect', () => {
  console.log("connected redis");
})

app.get('/users', (req, res) => {
  console.log('Received GET request for /users');
  client.zrange('users', 0, -1, (err, users) => {
    if (err) {
      console.error('Error fetching users from Redis:', err);
      res.status(500).send(err);
    } else {
      console.log('Users fetched from Redis:', users);
      res.send(users);
    }
  });
});

app.post("/" , async (req, res) => {
  const {key, value} = req.body;
  const response = await client.set(key,value);


  res.send(response);
})


app.post('/user', async (req, res) => {
  const { id, username, age } = req.body;
  console.log('Received POST request to add user:', req.body);
  
  // Ensure id, username, and age are strings
  if (!id || !username || !age) {
    return res.status(400).send('Invalid input');
  }
  
  await client.hSet(`user:${id}`, 'username', username, 'age', age.toString(), (err, reply) => {
    if (err) {
      console.error('Error adding user to Redis:', err);
      res.status(500).send(err);
    } else {
      console.log('User added to Redis:', reply);
      client.zadd('users', 0, `user:${id}`, (zerr, zreply) => {
        if (zerr) {
          console.error('Error adding user to sorted set:', zerr);
          res.status(500).send(zerr);
        } else {
          console.log('User added to sorted set:', zreply);
          res.send('User added');
        }
      });
    }
  });
});

const fetchPostsFromAPI = async () => {

  console.log("Fetched")
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};

// const cacheMiddleware = (req, res, next) => {
//   const { key } = req.params;
//   client.get(key, (err, data) => {
//     if (err) throw err;
//     if (data) {
//       res.send(JSON.parse(data));
//     } else {
//       next();
//     }
//   });
// };

app.get('/posts', async (req, res) => {
  try {
    const cachedPosts = await client.get('posts');

    if(cachedPosts){
      console.log("kesha")
      return res.json(JSON.parse(cachedPosts))
    }
    console.log("nekesa")
    const posts = await fetchPostsFromAPI();

    client.setEx('posts', 3600, JSON.stringify(posts)); // Caching for 1 hour
    
    res.send(posts);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});