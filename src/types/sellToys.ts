// Toy intake types, as the backend expects and sends them (toys.v1.SellToysService).

import type { IAddress } from './address';

export interface ISellToysPickupPointOption {
  address: IAddress;
  name: string;
  description?: string;
  /** Send it back in the offer; the backend resolves the address itself. */
  pickupPointId: string;
}

export interface ISellToysHomeCollectionOption {
  description?: string;
}

/** Exactly one member is set, mirroring the protobuf oneof. */
export interface ISellToysDeliveryOption {
  pickupPoint?: ISellToysPickupPointOption;
  homeCollection?: ISellToysHomeCollectionOption;
}

export interface IGetSellToysDeliveryOptionsResponse {
  deliveryOptions?: ISellToysDeliveryOption[];
}

/** Exactly one member is set, mirroring the protobuf oneof. */
export interface ISellDeliveryInfo {
  pickupPoint?: { pickupPointId: string };
  homeCollection?: { address: IAddress; deliveryNotes?: string };
}

export interface ISubmitOfferRequest {
  name: string;
  email: string;
  phone?: string;
  deliveryInfo: ISellDeliveryInfo;
  description?: string;
  /** Identifiers from CreatePhotoUpload; the form does not upload photos yet. */
  photoUploadIds?: string[];
  /** One UUID per submission, reused on a retry, so a repeat creates no second offer. */
  requestId: string;
}

export interface ISubmitOfferResponse {
  offerId: string;
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
