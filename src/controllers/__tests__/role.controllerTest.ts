import { Role, RoleDocument, RoleInput } from '../../models/role.model';

import mongoose = require('mongoose');

describe('product ', () => {
  beforeAll(async () => {
    // put your client connection code here, example with mongoose:
    // @ts-ignore
    await mongoose.connect(process.env['MONGO_URI']);
  });

  afterAll(async () => {
    const { collections } = mongoose.connection;

    for (const key in collections) {
      const collection = collections[key];

      // @ts-ignore
      collection.deleteMany();
    }
    await mongoose.disconnect();
  });

  it('can be created correctly', async () => {
    const name = 'name';
    const description = 'description';
    const roleInput: RoleInput = {
      name,
      description,
    };

    const roleCreated: RoleDocument = await Role.create(roleInput);
    const roles: RoleDocument[] = await Role.find().sort('-createdAt').exec();

    expect(roleCreated.name).toBe(name);
    expect(roleCreated.description).toBe(description);
    expect(roleCreated.id).not.toBeNull();

    expect(roles.length).toBe(1);
    expect(roles[0].id).toBe(roleCreated.id);
  });
});
