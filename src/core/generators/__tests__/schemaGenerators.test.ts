import { describe, it, expect } from 'vitest';
import {
  toJSONSchema,
  toOpenAPI,
  toPrisma,
  toPydantic,
  toRustSerde,
  toGoStruct,
} from '../schemaGenerators';

describe('Advanced Schema Generators', () => {
  const sampleUser = {
    id: 101,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    website: 'https://example.com',
    is_active: true,
    balance: 99.5,
    created_at: '2026-03-01T10:00:00Z',
    tags: ['admin', 'verified'],
    metadata: {
      login_count: 5,
      ip: '192.168.1.1',
    },
  };

  describe('toJSONSchema (Draft 2020-12)', () => {
    it('generates valid JSON Schema with correct types and required properties', () => {
      const result = toJSONSchema(sampleUser);
      const schema = JSON.parse(result);

      expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
      expect(schema.type).toBe('object');
      expect(schema.properties.id.type).toBe('integer');
      expect(schema.properties.email.type).toBe('string');
      expect(schema.properties.email.format).toBe('email');
      expect(schema.properties.website.format).toBe('uri');
      expect(schema.properties.is_active.type).toBe('boolean');
      expect(schema.properties.balance.type).toBe('number');
      expect(schema.properties.tags.type).toBe('array');
      expect(schema.properties.metadata.type).toBe('object');
      expect(schema.required).toContain('id');
      expect(schema.required).toContain('email');
    });

    it('handles arrays of objects correctly', () => {
      const list = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', extra: 'opt' },
      ];
      const result = toJSONSchema(list);
      const schema = JSON.parse(result);

      expect(schema.properties.id.type).toBe('integer');
      expect(schema.required).toContain('id');
      expect(schema.required).not.toContain('extra');
    });
  });

  describe('toOpenAPI (3.1 Spec Component)', () => {
    it('generates valid OpenAPI 3.1 YAML documentation', () => {
      const result = toOpenAPI(sampleUser);

      expect(result).toContain('openapi: 3.1.0');
      expect(result).toContain('components:');
      expect(result).toContain('schemas:');
      expect(result).toContain('DataModel:');
      expect(result).toContain('type: object');
      expect(result).toContain('format: email');
    });
  });

  describe('toPrisma (Prisma Schema Model)', () => {
    it('generates model with primary key and proper types', () => {
      const result = toPrisma(sampleUser);

      expect(result).toContain('model DataModel {');
      expect(result).toContain('@id');
      expect(result).toContain('email');
      expect(result).toContain('@unique');
      expect(result).toContain('Boolean');
      expect(result).toContain('DateTime');
    });

    it('injects synthetic id if dataset has no id field', () => {
      const result = toPrisma({ title: 'Task', done: false });
      expect(result).toContain('id               String   @id @default(uuid())');
      expect(result).toContain('title');
      expect(result).toContain('done');
    });
  });

  describe('toPydantic (Python Pydantic v2)', () => {
    it('generates BaseModel with typing imports and EmailStr', () => {
      const result = toPydantic(sampleUser);

      expect(result).toContain('class DataModel(BaseModel):');
      expect(result).toContain('from pydantic import BaseModel, EmailStr, HttpUrl');
      expect(result).toContain('id: int');
      expect(result).toContain('email: EmailStr');
      expect(result).toContain('website: HttpUrl');
      expect(result).toContain('is_active: bool');
      expect(result).toContain('created_at: datetime');
    });
  });

  describe('toRustSerde (Rust Struct with Serde)', () => {
    it('generates pub struct with Serialize and Deserialize derives', () => {
      const result = toRustSerde(sampleUser);

      expect(result).toContain('#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]');
      expect(result).toContain('pub struct DataModel {');
      expect(result).toContain('pub id: i64');
      expect(result).toContain('pub email: String');
      expect(result).toContain('pub is_active: bool');
    });
  });

  describe('toGoStruct (Go Struct with JSON tags)', () => {
    it('generates struct with package and tags', () => {
      const result = toGoStruct(sampleUser);

      expect(result).toContain('package models');
      expect(result).toContain('type DataModel struct {');
      expect(result).toContain('ID');
      expect(result).toContain('`json:"id"`');
      expect(result).toContain('Email');
      expect(result).toContain('string');
      expect(result).toContain('`json:"email"`');
    });
  });
});
