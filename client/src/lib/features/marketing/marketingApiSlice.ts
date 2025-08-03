import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import type {
  MarketingEmail,
  MarketingEmailDto,
  GetAllMarketingEmailsApiResponse,
  GetMarketingEmailApiResponse,
  SendCampaignApiResponse,
} from "./marketingTypes";

export const marketingApiSlice = createApi({
  reducerPath: "marketingApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["MarketingEmail", "MarketingEmails"],
  endpoints: (builder) => ({
    getAllMarketingEmails: builder.query<MarketingEmail[], void>({
      query: () => "/marketing/emails",
      transformResponse: (response: GetAllMarketingEmailsApiResponse) =>
        response.data.emails,
      providesTags: ["MarketingEmails"],
    }),
    getMarketingEmailById: builder.query<MarketingEmail, string>({
      query: (id) => `/marketing/emails/${id}`,
      transformResponse: (response: GetMarketingEmailApiResponse) =>
        response.data.email,
      providesTags: (result, error, id) => [{ type: "MarketingEmail", id }],
    }),
    createMarketingEmail: builder.mutation<MarketingEmail, MarketingEmailDto>({
      query: (newEmailData) => ({
        url: "/marketing/emails",
        method: "POST",
        body: newEmailData,
      }),
      invalidatesTags: ["MarketingEmails"],
    }),
    updateMarketingEmail: builder.mutation<
      MarketingEmail,
      { id: string; data: Partial<MarketingEmailDto> }
    >({
      query: ({ id, data }) => ({
        url: `/marketing/emails/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "MarketingEmails",
        { type: "MarketingEmail", id },
      ],
    }),
    deleteMarketingEmail: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/marketing/emails/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MarketingEmails"],
    }),
    sendCampaign: builder.mutation<SendCampaignApiResponse, string>({
      query: (id) => ({
        url: `/marketing/emails/${id}/send`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "MarketingEmails",
        { type: "MarketingEmail", id },
      ],
    }),
  }),
});

export const {
  useGetAllMarketingEmailsQuery,
  useGetMarketingEmailByIdQuery,
  useCreateMarketingEmailMutation,
  useUpdateMarketingEmailMutation,
  useDeleteMarketingEmailMutation,
  useSendCampaignMutation,
} = marketingApiSlice;
