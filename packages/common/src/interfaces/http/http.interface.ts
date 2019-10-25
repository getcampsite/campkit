/**
 * Internal
 */
import { HttpMethod } from '../../enums';
import { GenericObject } from '../utilities.interface';

export interface HttpRequest {
  method:
    | HttpMethod.GET
    | HttpMethod.POST
    | HttpMethod.PUT
    | HttpMethod.DELETE
    | HttpMethod.PATCH
    | HttpMethod.OPTIONS
    | HttpMethod.HEAD;
  path: string;
  headers: GenericObject;
  body: GenericObject; // null | json.stringify | {}
}
