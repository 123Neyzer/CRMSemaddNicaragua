#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/899e1b77bb22ee7a66c5d3c21eef15b25cd531a85287b7db8a5451435f94dc1f/contract';
import endContract from '../../snapshots/899e1b77bb22ee7a66c5d3c21eef15b25cd531a85287b7db8a5451435f94dc1f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey, unique } from '@prisma/orm-sqlite/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        table: 'User',
        columns: [
          col('email', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
          col('name', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
        ],
        constraints: [primaryKey(['id']), unique(['email'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
