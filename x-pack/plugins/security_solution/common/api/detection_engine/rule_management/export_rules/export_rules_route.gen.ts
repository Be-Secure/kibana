/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { z } from 'zod';
import { BooleanFromString } from '@kbn/zod-helpers';

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 */

import { RuleSignatureId } from '../../model/rule_schema/common_attributes.gen';

export type ExportRulesRequestQuery = z.infer<typeof ExportRulesRequestQuery>;
export const ExportRulesRequestQuery = z.object({
  /**
   * Determines whether a summary of the exported rules is returned.
   */
  exclude_export_details: BooleanFromString.optional().default(false),
  /**
   * File name for saving the exported rules.
   */
  file_name: z.string().optional().default('export.ndjson'),
});
export type ExportRulesRequestQueryInput = z.input<typeof ExportRulesRequestQuery>;

export type ExportRulesRequestBody = z.infer<typeof ExportRulesRequestBody>;
export const ExportRulesRequestBody = z
  .object({
    /**
     * Array of `rule_id` fields. Exports all rules when unspecified.
     */
    objects: z.array(
      z.object({
        rule_id: RuleSignatureId,
      })
    ),
  })
  .nullable();
export type ExportRulesRequestBodyInput = z.input<typeof ExportRulesRequestBody>;
