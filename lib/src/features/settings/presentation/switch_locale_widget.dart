import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/common_widgets/async_value_widget.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';

class SwitchLocaleWidget extends ConsumerWidget {
  const SwitchLocaleWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final localeProvider = ref.watch(localeControllerProvider);
    return AsyncValueWidget(
      value: localeProvider,
      data: (locale) {
        final languageCode = locale.languageCode == 'en' ? 'es' : 'en';
        return FloatingActionButton(
          onPressed: ref.read(localeControllerProvider.notifier).changeLocale,
          child: CountryFlag.fromLanguageCode(
            languageCode,
            shape: const Circle(),
          ),
        );
      },
    );
  }
}
