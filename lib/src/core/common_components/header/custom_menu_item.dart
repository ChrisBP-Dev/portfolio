import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';

class CustomMenuItem extends ConsumerStatefulWidget {
  const CustomMenuItem({
    required this.title,
    required this.path,
    super.key,
  });

  final String title;
  final String path;

  @override
  ConsumerState<CustomMenuItem> createState() => _CustomMenuItemConsumerState();
}

class _CustomMenuItemConsumerState extends ConsumerState<CustomMenuItem> {
  bool onHover = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bodySmall = theme.textTheme.bodySmall;
    final routerPath =
        GoRouter.of(context).routeInformationProvider.value.uri.path;

    final isSelected = widget.path == routerPath;

    return InkWell(
      onTap: isSelected.whenOrNull(
        isFalse: () => () => context.go(widget.path),
      ),
      onHover: (value) => setState(() => onHover = value),
      child: Padding(
        padding: const EdgeInsets.all(Sizes.globalPadding),
        child: isSelected.when(
          isTrue: () => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ShaderTextEffect(
                text: widget.title,
                gradient: AppColor.textBusinessGradient,
                style: bodySmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(
                height: 2,
                width: 10,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: AppColor.textBusinessGradient,
                  ),
                ),
              ),
              if (onHover) gapH2,
            ],
          ),
          isFalse: () => onHover.when(
            isTrue: () => Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.title,
                  style: bodySmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                SizedBox(
                  height: 2,
                  width: 10,
                  child: ColoredBox(
                    color: theme.colorScheme.primary,
                  ),
                ),
              ],
            ),
            isFalse: () => Text(widget.title, style: bodySmall),
          ),
        ),
      ),
    );
  }
}
