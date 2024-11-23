import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_widgets/shader_text_effect.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/core/utils/theme/color_app.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';

class AdminMenuItem extends StatefulWidget {
  const AdminMenuItem({
    required this.title,
    required this.path,
    super.key,
    this.onPageSelected,
  });

  final String title;
  final String path;
  final VoidCallback? onPageSelected;

  @override
  State<AdminMenuItem> createState() => _AdminMenuItemState();
}

class _AdminMenuItemState extends State<AdminMenuItem> {
  bool onHover = false;

  @override
  Widget build(BuildContext context) {
    final routerPath =
        GoRouter.of(context).routeInformationProvider.value.uri.path;

    final isSelected = widget.path == routerPath;

    return InkWell(
      onTap: isSelected.whenOrNull(
        isFalse: () => () {
          context.go(widget.path);
          Scaffold.maybeOf(context)?.closeDrawer();
          widget.onPageSelected?.call();
        },
      ),
      onHover: (value) => setState(() => onHover = value),
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: isSelected.whenOrNull(
            isTrue: () => Border(
              left: BorderSide(
                color: AppColor.textBusinessGradient.colors.last,
                width: 5,
              ),
            ),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(Sizes.globalPadding),
          child: isSelected.when(
            isTrue: () => ShaderTextEffect(
              text: widget.title,
              gradient: AppColor.textBusinessGradient,
              style: context.bodySmall?.copyWith(fontWeight: FontWeight.bold),
            ),
            isFalse: () => onHover.when(
              isTrue: () => Text(
                widget.title,
                style: context.bodySmall?.copyWith(fontWeight: FontWeight.bold),
              ),
              isFalse: () => Text(widget.title, style: context.bodySmall),
            ),
          ),
        ),
      ),
    );
  }
}
