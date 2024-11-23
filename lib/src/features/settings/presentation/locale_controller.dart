import 'package:flutter/material.dart';
import 'package:portfolio/src/features/settings/data/settings_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'locale_controller.g.dart';

@riverpod
class LocaleController extends _$LocaleController {
  @override
  Future<Locale> build() async {
    return ref.read(settingsRepositoryProvider).getLocale();
  }

  Future<void> changeLocale() async {
    final settingProvider = ref.read(settingsRepositoryProvider);
    state.whenData((locale) async {
      state = const AsyncLoading();
      state = await AsyncValue.guard(() async {
        final newLocale = locale.languageCode == 'en'
            ? const Locale('es')
            : const Locale('en');

        await settingProvider.setLocale(newLocale);
        return newLocale;
      });
    });
  }
}
