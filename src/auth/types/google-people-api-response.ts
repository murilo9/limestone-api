export type GooglePeopleApiResponse = {
  resourceName: string;
  eTag: string;
  names: Array<{
    metadata: {
      primary: boolean;
      source: {
        type: string;
        id: string;
      };
    };
    displayName: string;
    familyName: string;
    givenName: string;
    displayNameLastFirst: string;
    unstructuredName: string;
  }>;
};
