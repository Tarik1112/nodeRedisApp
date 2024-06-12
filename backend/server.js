const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const client = redis.createClient();

app.use(cors);
app.use((req, res ,next) =>
{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
        );
    if (req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }

  // Pass next middleware
  next();

});

app.get('/test', (req, res) => {
  console.log('Received a GET HTTP method');
  res.send("Teeetetete")
});

(async () => {
  // Connect to redis server
  await client.connect();
})();

// async function nodeRedisDemo() {
//     try {
//       await client.connect();
  
//       await client.set('name', 'Hello from node redis');
//       const myKeyValue = await client.get('name');
//       console.log(myKeyValue);
  
//       const numAdded = await client.zAdd('vehicles', [
//         {
//           score: 4,
//           value: 'car',
//         },
//         {
//           score: 2,
//           value: 'bike',
//         },
//       ]);
//       console.log(`Added ${numAdded} items.`);
  
//       for await (const { score, value } of client.zScanIterator('vehicles')) {
//         console.log(`${value} -> ${score}`);
//       }
  
//       await client.quit();
//     } catch (e) {
//       console.error(e);
//     }
//   }
  
//   nodeRedisDemo();
 

client.on('connect', () => {
    console.log('Connected to Redis!');
})



app.get('/users', (req, res) => {
    console.log('Received GET request for /users');
    client.zrange('users', 0, -1, (err, users) => {
      if (err) {
        console.error('Error fetching users from Redis:', err);
        res.status(500).send(err);
      } else {
        console.log('Users fetched from Redis:', users);
        return res.send(users);
      }
    });
  });

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
