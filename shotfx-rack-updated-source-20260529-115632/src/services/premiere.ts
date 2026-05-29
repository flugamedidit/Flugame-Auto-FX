export interface PremiereImportRequest {
  mediaId: string;
  name?: string;
  mimeType?: string;
}

export interface PremiereTimelineRequest {
  sequenceName?: string;
  trackIndex?: number;
}

export const premiere = {
  async importAsset(request: PremiereImportRequest): Promise<{ imported: boolean; itemId: string }> {
    console.info('Mock Premiere import:', request);
    return { imported: false, itemId: request.mediaId };
  },

  async addToTimeline(
    asset: PremiereImportRequest,
    options: PremiereTimelineRequest = {}
  ): Promise<{ added: boolean; itemId: string; sequenceName: string }> {
    console.info('Mock Premiere timeline add:', asset, options);
    return {
      added: false,
      itemId: asset.mediaId,
      sequenceName: options.sequenceName || 'Active Sequence'
    };
  },

  async exportSelection(): Promise<{ exported: boolean; path?: string }> {
    console.info('Mock Premiere export selection');
    return { exported: false };
  }
};
