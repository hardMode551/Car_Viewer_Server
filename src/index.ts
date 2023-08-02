import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import { MongoClient, Db, Collection, Document } from 'mongodb';
import { StockItem } from './types/carTypes';

const app: Express = express();
const port = process.env.PORT || 5001;

const mongoURL: string =
  process.env.MONGODB_URI || 'mongodb://hrTest:hTy785JbnQ5@mongo0.maximum.expert:27423/?authSource=hrTest&replicaSet=ReplicaSet&readPreference=primary';

let stockCollection: Collection<Document>;

app.use(express.json());
app.use(cors());

MongoClient.connect(mongoURL)
  .then((client: MongoClient) => {
    console.log('Connected to MongoDB');
    const db: Db = client.db('hrTest');
    stockCollection = db.collection('stock');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error: Error) => console.error('Error connecting to MongoDB', error));

// Обработчик запроса на получение данных о запасах автомобилей по марке и моделям
app.get('/api/stock', async (req: Request, res: Response) => {
  const { mark, models, page } = req.query;
  const limit = 20;
  const skip = (parseInt(String(page)) - 1) * limit;

  try {
    const filter = {
      ...(mark && { mark }),
         ...(models && { model: { $in: String(models).split(',') } }),
    };

    const stock: StockItem[] = await stockCollection.find(filter).skip(skip).limit(limit).toArray() as StockItem[];
    res.json(stock);
  } catch (error) {
    console.error('Error fetching stock', error);
    res.status(500).json({ error: 'Error fetching stock' });
  }
});