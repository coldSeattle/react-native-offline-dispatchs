import { TextVariableAnchorValues } from '@react-native-mapbox-gl/maps';
import { ApolloClient, NormalizedCacheObject, OperationVariables, QueryOptions } from 'apollo-boost';
import { DocumentNode } from 'graphql';
class GraphqlClient<T> {
    client: T;
    constructor() {
        this.client;
    }

    public useClientQuery(
        query: DocumentNode,
        variables: OperationVariables,
        options?: Partial<QueryOptions<TextVariableAnchorValues>>,
    ) {
        return this.client.query<any>(query, variables, ...options);
    }

    public useClient(
        query: DocumentNode,
        variables: OperationVariables,
        options?: Partial<QueryOptions<TextVariableAnchorValues>>,
    ) {
        return function () {
            return this.client;
        };
    }
}

export default GraphqlClient;
