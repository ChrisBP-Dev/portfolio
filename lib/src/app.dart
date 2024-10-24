import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/core/utils/theme/theme_app.dart';
import 'package:portfolio/src/features/settings/presentation/locale_controller.dart';
import 'package:portfolio/src/features/settings/presentation/theme_controller.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/app_router.dart';

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final goRouter = ref.watch(goRouterProvider);
    final screenWidth = MediaQuery.sizeOf(context).width;
    final darkTheme = ref.read(darkThemeProvider(screenWidth));
    final lightTheme = ref.read(lightThemeProvider(screenWidth));
    final themeProvider = ref.watch(themeControllerProvider);
    final localeProvider = ref.watch(localeControllerProvider);

    return MaterialApp.router(
      routerConfig: goRouter,
      debugShowCheckedModeBanner: false,
      restorationScopeId: 'app',
      onGenerateTitle: (BuildContext context) => 'ChrisBP',
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: themeProvider.valueOrNull,
      locale: localeProvider.valueOrNull,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
    );
  }
}
