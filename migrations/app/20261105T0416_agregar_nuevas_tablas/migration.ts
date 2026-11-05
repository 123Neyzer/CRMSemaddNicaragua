#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/4fcbe2e7e982e48226c8da68439134d550ae946cd60816345243a48d372ac339/contract';
import endContract from '../../snapshots/4fcbe2e7e982e48226c8da68439134d550ae946cd60816345243a48d372ac339/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/899e1b77bb22ee7a66c5d3c21eef15b25cd531a85287b7db8a5451435f94dc1f/contract';
import startContract from '../../snapshots/899e1b77bb22ee7a66c5d3c21eef15b25cd531a85287b7db8a5451435f94dc1f/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  foreignKey,
  lit,
  sql,
  unique,
} from '@prisma/orm-sqlite/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        table: 'client',
        columns: [
          col('classification', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('empresaId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
          col('fullName', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('summary', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('telephone', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
        ],
        constraints: [foreignKey(['empresaId'], 'enterprise', ['id'])],
      }),
      this.createTable({
        table: 'conversation',
        columns: [
          col('canal', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('clientId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('enterpriseId', 'INTEGER', {
            notNull: true,
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('message', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('userId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
        ],
        constraints: [
          foreignKey(['clientId'], 'client', ['id']),
          foreignKey(['userId'], 'users', ['id']),
          foreignKey(['enterpriseId'], 'enterprise', ['id']),
        ],
      }),
      this.createTable({
        table: 'detailconversation',
        columns: [
          col('content', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('conversationId', 'INTEGER', {
            notNull: true,
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('message', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('typeagent', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('userenterpriseId', 'INTEGER', {
            notNull: true,
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
        ],
        constraints: [
          foreignKey(['userenterpriseId'], 'userenterprise', ['id']),
          foreignKey(['conversationId'], 'conversation', ['id']),
        ],
      }),
      this.createTable({
        table: 'enterprise',
        columns: [
          col('country', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('nameenterprise', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('userId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
        ],
        constraints: [foreignKey(['userId'], 'users', ['id'])],
      }),
      this.createTable({
        table: 'task',
        columns: [
          col('clientId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('description', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('fechadeVencimiento', 'TEXT', {
            notNull: true,
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('priority', 'TEXT', {
            notNull: true,
            default: lit('media'),
            codecRef: { codecId: 'sqlite/text@1' },
          }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('title', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('userenterpriseId', 'INTEGER', {
            notNull: true,
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
        ],
        constraints: [
          foreignKey(['clientId'], 'client', ['id']),
          foreignKey(['userenterpriseId'], 'userenterprise', ['id']),
        ],
      }),
      this.createTable({
        table: 'userenterprise',
        columns: [
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('email', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('enterpriseId', 'INTEGER', {
            notNull: true,
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('fullName', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('password', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('role', 'TEXT', {
            notNull: true,
            default: lit('agente'),
            codecRef: { codecId: 'sqlite/text@1' },
          }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
          col('userId', 'INTEGER', { notNull: true, codecRef: { codecId: 'sqlite/integer@1' } }),
          col('username', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
        ],
        constraints: [
          foreignKey(['userId'], 'users', ['id']),
          foreignKey(['enterpriseId'], 'enterprise', ['id']),
        ],
      }),
      this.createTable({
        table: 'users',
        columns: [
          col('createdAt', 'TEXT', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'sqlite/datetime@1' },
          }),
          col('email', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('id', 'INTEGER PRIMARY KEY AUTOINCREMENT'),
          col('name', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('password', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/text@1' } }),
          col('role', 'TEXT', {
            notNull: true,
            default: lit('admin'),
            codecRef: { codecId: 'sqlite/text@1' },
          }),
          col('state', 'INTEGER', {
            notNull: true,
            default: lit('1'),
            codecRef: { codecId: 'sqlite/integer@1' },
          }),
          col('updatedAt', 'TEXT', { notNull: true, codecRef: { codecId: 'sqlite/datetime@1' } }),
        ],
        constraints: [unique(['email'])],
      }),
      this.createIndex({
        table: 'client',
        index: 'client_empresaId_idx_2ace4994',
        columns: ['empresaId'],
      }),
      this.createIndex({
        table: 'conversation',
        index: 'conversation_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        table: 'conversation',
        index: 'conversation_enterpriseId_idx_c87d438a',
        columns: ['enterpriseId'],
      }),
      this.createIndex({
        table: 'conversation',
        index: 'conversation_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        table: 'detailconversation',
        index: 'detailconversation_conversationId_idx_669215a6',
        columns: ['conversationId'],
      }),
      this.createIndex({
        table: 'detailconversation',
        index: 'detailconversation_userenterpriseId_idx_1aebc431',
        columns: ['userenterpriseId'],
      }),
      this.createIndex({
        table: 'enterprise',
        index: 'enterprise_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        table: 'task',
        index: 'task_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        table: 'task',
        index: 'task_userenterpriseId_idx_1aebc431',
        columns: ['userenterpriseId'],
      }),
      this.createIndex({
        table: 'userenterprise',
        index: 'userenterprise_enterpriseId_idx_c87d438a',
        columns: ['enterpriseId'],
      }),
      this.createIndex({
        table: 'userenterprise',
        index: 'userenterprise_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.dropTable({ table: 'User' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
