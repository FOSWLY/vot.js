import { VideoService } from "../service";
import { TranslationExtraOpts, TranslationHelp } from "../yandex";
import { BaseProviderOpts, BaseVideoTranslationOpts } from "./base";

export type YandexProviderOpts = BaseProviderOpts & {
  apiToken?: string;
};

export type YandexVideoTranslationOpts<T extends string = VideoService> =
  BaseVideoTranslationOpts<T> & {
    translationHelp?: TranslationHelp[] | null;
    /**
     * extra translation options (doesn't work with VOT Backend API)
     */
    extraOpts?: TranslationExtraOpts;
    /**
     * for bypass youtube long waiting (doesn't work with VOT Backend API)
     */
    shouldSendFailedAudio?: boolean;
  };
