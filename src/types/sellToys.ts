// Toy intake types, as the backend expects them (toys.v1.SellToysService).

import type { IAddress } from './address';

/** Exactly one member is set, mirroring the protobuf oneof. */
export interface ISellDeliveryInfo {
  /** The seller brings the toys to the shop's pickup point. */
  pickupPoint?: Record<string, never>;
  /** The shop collects the toys from the seller. */
  homeCollection?: { address: IAddress };
}

export interface ISubmitOfferRequest {
  name: string;
  email: string;
  phone: string;
  deliveryInfo: ISellDeliveryInfo;
  description?: string;
  /** Identifiers returned by CreatePhotoUpload; the form does not upload photos yet. */
  photoUploadIds?: string[];
}

export interface ICreatePhotoUploadRequest {
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface ICreatePhotoUploadResponse {
  uploadId: string;
  uploadUrl: string;
  uploadHeaders?: Record<string, string>;
}
