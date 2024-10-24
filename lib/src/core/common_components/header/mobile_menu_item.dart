import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_components/header/header_menu_controller.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';

const kmobileMenuItemHeight = 50.0;

class MobileMenuItem extends ConsumerWidget {
  const MobileMenuItem({
    required this.title,
    required this.path,
    super.key,
  });

  final String title;
  final String path;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final bodyLarge = theme.textTheme.bodyLarge;
    final routerPath =
        GoRouter.of(context).routeInformationProvider.value.uri.path;

    final isSelected = path == routerPath;

    return ElevatedButton(
      style: ButtonStyle(
        overlayColor: WidgetStateProperty.all<Color>(
          isSelected.when(
            isFalse: () =>
                AppColor.textBusinessGradient.colors.last.withOpacity(.3),
            isTrue: () => theme.colorScheme.primary,
          ),
        ),
        splashFactory: NoSplash.splashFactory,
        backgroundColor: WidgetStateProperty.all<Color>(
          isSelected.when(
            isFalse: () => theme.scaffoldBackgroundColor,
            isTrue: () => theme.colorScheme.primary,
          ),
        ),
        shape: WidgetStateProperty.all<OutlinedBorder>(
          const RoundedRectangleBorder(),
        ),
      ),
      onPressed: isSelected.whenOrNull(
        isFalse: () => () {
          ref.read(headerMenuControllerProvider.notifier).toggleMenu();
          context.go(path);
        },
      ),
      child: Container(
        height: kmobileMenuItemHeight,
        alignment: Alignment.center,
        child: isSelected.when(
          isTrue: () => ShaderTextEffect(
            text: title,
            gradient: AppColor.textBusinessGradient,
            style: bodyLarge?.copyWith(fontWeight: FontWeight.bold),
          ),
          isFalse: () => Text(
            title,
            style: bodyLarge?.copyWith(
              color: theme.colorScheme.primary,
            ),
          ),
        ),
      ),
    );
  }
}
